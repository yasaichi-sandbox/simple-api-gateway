import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http.ts';
import { Configuration} from '../configuration.ts'
import { Observable, of, from } from '../rxjsStub.ts';
import {mergeMap, map} from  '../rxjsStub.ts';
import { Post } from '../models/Post.ts';
import { User } from '../models/User.ts';

import { PostApiRequestFactory, PostApiResponseProcessor} from "../apis/PostApi.ts";
export class ObservablePostApi {
    private requestFactory: PostApiRequestFactory;
    private responseProcessor: PostApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: PostApiRequestFactory,
        responseProcessor?: PostApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new PostApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new PostApiResponseProcessor();
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public getPostsWithHttpInfo(userId?: number, limit?: number, _options?: Configuration): Observable<HttpInfo<Array<Post>>> {
        const requestContextPromise = this.requestFactory.getPosts(userId, limit, _options);

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
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getPostsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get posts
     * @param userId Filter results by user ID
     * @param limit Limit results by number
     */
    public getPosts(userId?: number, limit?: number, _options?: Configuration): Observable<Array<Post>> {
        return this.getPostsWithHttpInfo(userId, limit, _options).pipe(map((apiResponse: HttpInfo<Array<Post>>) => apiResponse.data));
    }

}

import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi.ts";
export class ObservableUserApi {
    private requestFactory: UserApiRequestFactory;
    private responseProcessor: UserApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: UserApiRequestFactory,
        responseProcessor?: UserApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new UserApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new UserApiResponseProcessor();
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public getUserByIdWithHttpInfo(userId: number, _options?: Configuration): Observable<HttpInfo<User>> {
        const requestContextPromise = this.requestFactory.getUserById(userId, _options);

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
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUserByIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user by ID
     * @param userId key: id of user
     */
    public getUserById(userId: number, _options?: Configuration): Observable<User> {
        return this.getUserByIdWithHttpInfo(userId, _options).pipe(map((apiResponse: HttpInfo<User>) => apiResponse.data));
    }

}
