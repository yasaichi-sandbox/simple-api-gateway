import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http.ts';
import { Configuration} from '../configuration.ts'

import { Post } from '../models/Post.ts';
import { User } from '../models/User.ts';
import { ObservableDefaultApi } from './ObservableAPI.ts';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi.ts";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public postsGetWithHttpInfo(userId?: number, limit?: number, _options?: Configuration): Promise<HttpInfo<Array<Post>>> {
        const result = this.api.postsGetWithHttpInfo(userId, limit, _options);
        return result.toPromise();
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public postsGet(userId?: number, limit?: number, _options?: Configuration): Promise<Array<Post>> {
        const result = this.api.postsGet(userId, limit, _options);
        return result.toPromise();
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public usersUserIdGetWithHttpInfo(userId: number, _options?: Configuration): Promise<HttpInfo<User>> {
        const result = this.api.usersUserIdGetWithHttpInfo(userId, _options);
        return result.toPromise();
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public usersUserIdGet(userId: number, _options?: Configuration): Promise<User> {
        const result = this.api.usersUserIdGet(userId, _options);
        return result.toPromise();
    }


}



