/*
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import * as AWS from 'aws-sdk';
import {
	AccountConfig,
	BindContext,
	ConsumeEventsContext,
	DeployContext, IBindContext,
	IDeployContext,
	IPreDeployContext,
	IUnBindContext,
	IUnDeployContext,
	IUnPreDeployContext,
	PreDeployContext,
	ProduceEventsContext,
	ServiceConfig,
	ServiceContext,
	ServiceDeployer,
	UnDeployContext
} from 'handel-extension-api';
import {
	awsCalls,
	bindPhase,
	deletePhases,
	deployPhase,
	handlebars,
	preDeployPhase,
	tagging
} from 'handel-extension-support';
import * as winston from 'winston';
import {CustomDomain, LoggingServiceConfig} from './config-types';
import * as uuid from 'uuid';

const SERVICE_NAME = 'Cloudwatch Logger';

const VALID_HOSTNAME_REGEX = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

function checkCustomDomains(customDomains?: CustomDomain[]): string[] {
	if (!customDomains || customDomains.length === 0) {
		return [];
	}
	// equivalent to flatMap
	return customDomains.map(checkCustomDomain)
		.reduce((acc, cur) => acc.concat(cur), []);
}

function checkCustomDomain(domain: CustomDomain): string[] {
	const errors = [];
	if (!domain.dns_name) {
		errors.push(`${SERVICE_NAME} - 'dns_name' parameter is required`);
	} else if (!isValidHostname(domain.dns_name)) {
		errors.push(`${SERVICE_NAME} - 'dns_name' must be a valid DNS hostname`);
	}
	if (!domain.https_certificate) {
		errors.push(`${SERVICE_NAME} - 'https_certificate' parameter is required`);
	}
	return errors;
}

function isValidHostname(hostname: string): boolean {
	return !!hostname.match(VALID_HOSTNAME_REGEX);
}

export class CloudWatchLoggingService implements ServiceDeployer {
	public readonly consumedDeployOutputTypes = [];
	public readonly producedDeployOutputTypes = ['environmentVariables'];
	public readonly producedEventsSupportedServices = [];
	public readonly supportsTagging = true;

	public check(serviceContext: ServiceContext<LoggingServiceConfig>, dependenciesServiceContexts: Array<ServiceContext<ServiceConfig>>): string[] {
		const {params} = serviceContext;
		const {log_group_name, custom_domains} = params;

		const errors = checkCustomDomains(custom_domains);

		return errors;
	}

	// public async preDeploy(serviceContext: ServiceContext<ServiceConfig>): Promise<PreDeployContext> {
	// 	return undefined;
	// }

	// public async bind(ownServiceContext: ServiceContext<ServiceConfig>, ownPreDeployContext: IPreDeployContext, dependentOfServiceContext: ServiceContext<ServiceConfig>, dependentOfPreDeployContext: IPreDeployContext): Promise<IBindContext> {
	// 	return undefined;
	// }

	// TODO create cloudwatch log group and send logs there
	// TODO put API gateway on custom domains if provided
	// TODO figure out what to return
	public async deploy(ownServiceContext: ServiceContext<LoggingServiceConfig>, ownPreDeployContext: PreDeployContext, dependenciesDeployContexts: DeployContext[]): Promise<DeployContext> {

		const stackName = ownServiceContext.stackName();
		winston.info(`${SERVICE_NAME} - Deploying Cloudwatch Logging service '${stackName}'`);

		const s3FileName = `logger-deployable-${uuid()}.zip`;
		winston.info(`${SERVICE_NAME} - Uploading deployable artifact to S3: ${s3FileName}`);
		const s3ArtifactInfo = await deployPhase.uploadDeployableArtifactToHandelBucket(ownServiceContext, `${__dirname}/lambda`, s3FileName);
		winston.info(`${SERVICE_NAME} - Uploaded deployable artifact to S3: ${s3FileName}`);

		const handlebarsParams: any = {
			apiName: stackName,
			s3Bucket: s3ArtifactInfo.Bucket,
			s3Key: s3ArtifactInfo.Key,
		};
		let compiledTemplate = await handlebars.compileTemplate(`${__dirname}/template.yml`, handlebarsParams);

		const stackTags = tagging.getTags(ownServiceContext);
		const deployedStack = await deployPhase.deployCloudFormationStack(stackName, compiledTemplate, [], true, SERVICE_NAME, 30, stackTags);

		winston.info(`${SERVICE_NAME} - Finished deploying API Gateway service.`);
		return new DeployContext(ownServiceContext);
	}

	// public async unBind(ownServiceContext: ServiceContext<ServiceConfig>): Promise<IUnBindContext> {
	// 	return undefined;
	// }

	// TODO implement
	// public async unPreDeploy(ownServiceContext: ServiceContext<ServiceConfig>): Promise<IUnPreDeployContext> {
	// 	return undefined;
	// }
	//
	// public async unDeploy(ownServiceContext: ServiceContext<ServiceConfig>): Promise<IUnDeployContext> {
	// 	return undefined;
	// }
}