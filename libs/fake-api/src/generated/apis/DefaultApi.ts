/* tslint:disable */
/* eslint-disable */
/**
 * JSONPlaceholder
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime.ts';
import type {
  Post,
  User,
} from '../models/index.ts';
import {
    PostFromJSON,
    PostToJSON,
    UserFromJSON,
    UserToJSON,
} from '../models/index.ts';

export interface PostsGetRequest {
    userId?: number;
    limit?: number;
}

export interface UsersUserIdGetRequest {
    userId: number;
}

/**
 * DefaultApi - interface
 * 
 * @export
 * @interface DefaultApiInterface
 */
export interface DefaultApiInterface {
    /**
     * Get posts
     * @param {number} [userId] Filter results by user ID
     * @param {number} [limit] Limit results by number
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    postsGetRaw(requestParameters: PostsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Post>>>;

    /**
     * Get posts
     */
    postsGet(requestParameters: PostsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Post>>;

    /**
     * Get user by ID
     * @param {number} userId key: id of user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApiInterface
     */
    usersUserIdGetRaw(requestParameters: UsersUserIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>>;

    /**
     * Get user by ID
     */
    usersUserIdGet(requestParameters: UsersUserIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User>;

}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI implements DefaultApiInterface {

    /**
     * Get posts
     */
    async postsGetRaw(requestParameters: PostsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Post>>> {
        const queryParameters: any = {};

        if (requestParameters.userId !== undefined) {
            queryParameters['userId'] = requestParameters.userId;
        }

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/posts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PostFromJSON));
    }

    /**
     * Get posts
     */
    async postsGet(requestParameters: PostsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Post>> {
        const response = await this.postsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get user by ID
     */
    async usersUserIdGetRaw(requestParameters: UsersUserIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling usersUserIdGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/users/{user-id}`.replace(`{${"user-id"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * Get user by ID
     */
    async usersUserIdGet(requestParameters: UsersUserIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.usersUserIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}