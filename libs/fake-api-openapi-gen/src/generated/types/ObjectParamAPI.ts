import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http.ts';
import { Configuration} from '../configuration.ts'

import { Post } from '../models/Post.ts';
import { User } from '../models/User.ts';

import { ObservableDefaultApi } from "./ObservableAPI.ts";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi.ts";

export interface DefaultApiPostsGetRequest {
    /**
     * Filter results by user ID
     * @type number
     * @memberof DefaultApipostsGet
     */
    userId?: number
    /**
     * Limit results by number
     * @type number
     * @memberof DefaultApipostsGet
     */
    limit?: number
}

export interface DefaultApiUsersUserIdGetRequest {
    /**
     * key: id of user
     * @type number
     * @memberof DefaultApiusersUserIdGet
     */
    userId: number
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get posts
     * @param param the request object
     */
    public postsGetWithHttpInfo(param: DefaultApiPostsGetRequest = {}, options?: Configuration): Promise<HttpInfo<Array<Post>>> {
        return this.api.postsGetWithHttpInfo(param.userId, param.limit,  options).toPromise();
    }

    /**
     * Get posts
     * @param param the request object
     */
    public postsGet(param: DefaultApiPostsGetRequest = {}, options?: Configuration): Promise<Array<Post>> {
        return this.api.postsGet(param.userId, param.limit,  options).toPromise();
    }

    /**
     * Get user by ID
     * @param param the request object
     */
    public usersUserIdGetWithHttpInfo(param: DefaultApiUsersUserIdGetRequest, options?: Configuration): Promise<HttpInfo<User>> {
        return this.api.usersUserIdGetWithHttpInfo(param.userId,  options).toPromise();
    }

    /**
     * Get user by ID
     * @param param the request object
     */
    public usersUserIdGet(param: DefaultApiUsersUserIdGetRequest, options?: Configuration): Promise<User> {
        return this.api.usersUserIdGet(param.userId,  options).toPromise();
    }

}
