import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http.ts';
import { Configuration} from '../configuration.ts'
import { Observable, of, from } from '../rxjsStub.ts';
import {mergeMap, map} from  '../rxjsStub.ts';
import { Post } from '../models/Post.ts';
import { User } from '../models/User.ts';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi.ts";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public postsGetWithHttpInfo(userId?: number, limit?: number, _options?: Configuration): Observable<HttpInfo<Array<Post>>> {
        const requestContextPromise = this.requestFactory.postsGet(userId, limit, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public postsGet(userId?: number, limit?: number, _options?: Configuration): Observable<Array<Post>> {
        return this.postsGetWithHttpInfo(userId, limit, _options).pipe(map((apiResponse: HttpInfo<Array<Post>>) => apiResponse.data));
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public usersUserIdGetWithHttpInfo(userId: number, _options?: Configuration): Observable<HttpInfo<User>> {
        const requestContextPromise = this.requestFactory.usersUserIdGet(userId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.usersUserIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public usersUserIdGet(userId: number, _options?: Configuration): Observable<User> {
        return this.usersUserIdGetWithHttpInfo(userId, _options).pipe(map((apiResponse: HttpInfo<User>) => apiResponse.data));
    }

}
