import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http.ts';
import { Configuration} from '../configuration.ts'

import { Post } from '../models/Post.ts';
import { User } from '../models/User.ts';

import { ObservablePostApi } from "./ObservableAPI.ts";
import { PostApiRequestFactory, PostApiResponseProcessor} from "../apis/PostApi.ts";

export interface PostApiGetPostsRequest {
    /**
     * Filter results by user ID
     * @type number
     * @memberof PostApigetPosts
     */
    userId?: number
    /**
     * Limit results by number
     * @type number
     * @memberof PostApigetPosts
     */
    limit?: number
}

export class ObjectPostApi {
    private api: ObservablePostApi

    public constructor(configuration: Configuration, requestFactory?: PostApiRequestFactory, responseProcessor?: PostApiResponseProcessor) {
        this.api = new ObservablePostApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get posts
     * @param param the request object
     */
    public getPostsWithHttpInfo(param: PostApiGetPostsRequest = {}, options?: Configuration): Promise<HttpInfo<Array<Post>>> {
        return this.api.getPostsWithHttpInfo(param.userId, param.limit,  options).toPromise();
    }

    /**
     * Get posts
     * @param param the request object
     */
    public getPosts(param: PostApiGetPostsRequest = {}, options?: Configuration): Promise<Array<Post>> {
        return this.api.getPosts(param.userId, param.limit,  options).toPromise();
    }

}

import { ObservableUserApi } from "./ObservableAPI.ts";
import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi.ts";

export interface UserApiGetUserByIdRequest {
    /**
     * key: id of user
     * @type number
     * @memberof UserApigetUserById
     */
    userId: number
}

export class ObjectUserApi {
    private api: ObservableUserApi

    public constructor(configuration: Configuration, requestFactory?: UserApiRequestFactory, responseProcessor?: UserApiResponseProcessor) {
        this.api = new ObservableUserApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get user by ID
     * @param param the request object
     */
    public getUserByIdWithHttpInfo(param: UserApiGetUserByIdRequest, options?: Configuration): Promise<HttpInfo<User>> {
        return this.api.getUserByIdWithHttpInfo(param.userId,  options).toPromise();
    }

    /**
     * Get user by ID
     * @param param the request object
     */
    public getUserById(param: UserApiGetUserByIdRequest, options?: Configuration): Promise<User> {
        return this.api.getUserById(param.userId,  options).toPromise();
    }

}
