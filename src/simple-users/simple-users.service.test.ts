import {
  FakeApiModule,
  type Post,
  type RequestAdapter,
  type User,
} from '@app/fake-api';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from '@std/testing/bdd';
import assert from 'node:assert';
import { match, type SinonStubbedInstance, stub } from 'sinon';
import { SimpleUsersService } from './simple-users.service.ts';

describe(SimpleUsersService.name, () => {
  let service: SimpleUsersService;

  describe('#findOneWithLatestPosts()', () => {
    let requestAdapter: SinonStubbedInstance<RequestAdapter>;

    const userId = 42;
    const user: User = {
      id: userId,
      name: 'Foo Bar',
      username: 'foobar',
      email: 'foo.bar@example.com',
    };
    const posts: Post[] = [{
      id: 1,
      userId,
      title: 'post 1 title',
      body: 'post 1 body',
    }];

    beforeEach(async () => {
      requestAdapter = stub(
        { send() {}, sendCollection() {} } as unknown as RequestAdapter,
      );
      requestAdapter.send.resolves(user);
      requestAdapter.sendCollection.resolves(posts);

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          FakeApiModule.register({
            baseUrl: 'https://example.com/',
            requestAdapter,
          }),
        ],
        providers: [SimpleUsersService],
      }).compile();

      service = module.get(SimpleUsersService);
    });

    it('should return a specified user with the latest posts', async () => {
      const userWithLatestPosts = await service.findOneWithLatestPosts(userId);

      assert.deepStrictEqual(userWithLatestPosts, {
        id: user.id,
        username: user.username,
        latestPosts: [{ id: posts[0].id, title: posts[0].title }],
      });
      assert(
        requestAdapter.send.calledOnceWith(
          match.has('httpMethod', 'GET').and(
            match.has('URL', match(new RegExp(`/users/${userId}$`))),
          ),
        ),
      );
      assert(
        requestAdapter.sendCollection.calledOnceWith(
          match.has('httpMethod', 'GET').and(match.has(
            'URL',
            match(new RegExp(`\/posts\\?limit=5&userId=${userId}$`)),
          )),
        ),
      );
    });
  });
});
