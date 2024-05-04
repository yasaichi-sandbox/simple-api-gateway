import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http.ts';
import { Configuration} from '../configuration.ts'

import { Post } from '../models/Post.ts';
import { User } from '../models/User.ts';
import { ObservablePostApi } from './ObservableAPI.ts';

import { PostApiRequestFactory, PostApiResponseProcessor} from "../apis/PostApi.ts";
export class PromisePostApi {
    private api: ObservablePostApi

    public constructor(
        configuration: Configuration,
        requestFactory?: PostApiRequestFactory,
        responseProcessor?: PostApiResponseProcessor
    ) {
        this.api = new ObservablePostApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public getPostsWithHttpInfo(userId?: number, limit?: number, _options?: Configuration): Promise<HttpInfo<Array<Post>>> {
        const result = this.api.getPostsWithHttpInfo(userId, limit, _options);
        return result.toPromise();
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public getPosts(userId?: number, limit?: number, _options?: Configuration): Promise<Array<Post>> {
        const result = this.api.getPosts(userId, limit, _options);
        return result.toPromise();
    }


}



import { ObservableUserApi } from './ObservableAPI.ts';

import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi.ts";
export class PromiseUserApi {
    private api: ObservableUserApi

    public constructor(
        configuration: Configuration,
        requestFactory?: UserApiRequestFactory,
        responseProcessor?: UserApiResponseProcessor
    ) {
        this.api = new ObservableUserApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public getUserByIdWithHttpInfo(userId: number, _options?: Configuration): Promise<HttpInfo<User>> {
        const result = this.api.getUserByIdWithHttpInfo(userId, _options);
        return result.toPromise();
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public getUserById(userId: number, _options?: Configuration): Promise<User> {
        const result = this.api.getUserById(userId, _options);
        return result.toPromise();
    }


}



