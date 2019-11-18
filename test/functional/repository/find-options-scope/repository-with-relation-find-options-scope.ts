import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src/connection/Connection";
import {PostWithRelation} from "./entity/PostWithRelation";

describe("repository > query scope with relation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should set defalut query scope with relation correctly", () => Promise.all(connections.map(async connection => {

        const post1 = new PostWithRelation();
        post1.title = "title#1";
        const post2 = new PostWithRelation();
        post2.title = "title#2";
        const post3 = new PostWithRelation();
        post3.title = "title#3";

        await connection.manager.save(post1);
        await connection.manager.save(post2);
        await connection.manager.save(post3);

        const loadedWithDefaultScopePosts = await connection
            .getRepository(PostWithRelation)
            .find();
        loadedWithDefaultScopePosts!.length.should.be.equal(1);
        loadedWithDefaultScopePosts![0].title.should.be.equals("title#2");

        const loadedWithDefaultScopePost = await connection
            .getRepository(PostWithRelation)
            .findOne();
        loadedWithDefaultScopePost!.title.should.be.equals("title#2");

    })));

    it("should set custom query scope with relation correctly", () => Promise.all(connections.map(async connection => {

        const post1 = new PostWithRelation();
        post1.title = "title#1";
        const post2 = new PostWithRelation();
        post2.title = "title#2";
        const post3 = new PostWithRelation();
        post3.title = "title#3";

        await connection.manager.save(post1);
        await connection.manager.save(post2);
        await connection.manager.save(post3);

        const loadedWithCustomScopePosts = await connection
            .getRepository(PostWithRelation)
            .find({
                scope: "title3",
            });

        loadedWithCustomScopePosts!.length.should.be.equal(1);
        loadedWithCustomScopePosts![0].title.should.be.equals("title#3");

        const loadedWithCustomScopePost = await connection
            .getRepository(PostWithRelation)
            .findOne(3, {
                scope: "title3",
            });
        loadedWithCustomScopePost!.title.should.be.equals("title#3");

    })));

    it("should not set query scope with relation when the scope is set to false", () => Promise.all(connections.map(async connection => {

        const post1 = new PostWithRelation();
        post1.title = "title#1";
        const post2 = new PostWithRelation();
        post2.title = "title#2";
        const post3 = new PostWithRelation();
        post3.title = "title#3";

        await connection.manager.save(post1);
        await connection.manager.save(post2);
        await connection.manager.save(post3);

        const loadedWithoutScopePosts = await connection
            .getRepository(PostWithRelation)
            .find({
                scope: false,
            });

        loadedWithoutScopePosts!.length.should.be.equal(3);
        loadedWithoutScopePosts![0].title.should.be.equals("title#1");
        loadedWithoutScopePosts![1].title.should.be.equals("title#2");
        loadedWithoutScopePosts![2].title.should.be.equals("title#3");

        const loadedWithoutScopePost = await connection
            .getRepository(PostWithRelation)
            .findOne({
                scope: false,
            });
        loadedWithoutScopePost!.title.should.be.equals("title#1");

    })));
});