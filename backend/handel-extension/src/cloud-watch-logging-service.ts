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
import {LoggingServiceConfig} from './config-types';

export class CloudWatchLoggingService implements ServiceDeployer {
	public readonly consumedDeployOutputTypes = [];
	public readonly producedDeployOutputTypes = ['environmentVariables'];
	public readonly producedEventsSupportedServices = [];
	public readonly supportsTagging = true;

	public check(serviceContext: ServiceContext<LoggingServiceConfig>, dependenciesServiceContexts: Array<ServiceContext<ServiceConfig>>): string[] {
		const {params} = serviceContext;
		const {log_group_name} = params;
		console.log(log_group_name);
		return [];
	}

	// public async preDeploy(serviceContext: ServiceContext<ServiceConfig>): Promise<PreDeployContext> {
	// 	return undefined;
	// }
	//
	// public async bind(ownServiceContext: ServiceContext<ServiceConfig>, ownPreDeployContext: IPreDeployContext, dependentOfServiceContext: ServiceContext<ServiceConfig>, dependentOfPreDeployContext: IPreDeployContext): Promise<IBindContext> {
	// 	return undefined;
	// }
	//
	// public async deploy(ownServiceContext: ServiceContext<ServiceConfig>, ownPreDeployContext: IPreDeployContext, dependenciesDeployContexts: IDeployContext[]): Promise<IDeployContext> {
	// 	return undefined;
	// }
	//
	// public async unBind(ownServiceContext: ServiceContext<ServiceConfig>): Promise<IUnBindContext> {
	// 	return undefined;
	// }
	//
	// public async unPreDeploy(ownServiceContext: ServiceContext<ServiceConfig>): Promise<IUnPreDeployContext> {
	// 	return undefined;
	// }
	//
	// public async unDeploy(ownServiceContext: ServiceContext<ServiceConfig>): Promise<IUnDeployContext> {
	// 	return undefined;
	// }
}