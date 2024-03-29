/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
import { type AdditionalDataHolder, type Parsable, type ParseNode, type SerializationWriter } from '@microsoft/kiota-abstractions';

/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {Post}
 */
export function createPostFromDiscriminatorValue(parseNode: ParseNode | undefined) : ((instance?: Parsable) => Record<string, (node: ParseNode) => void>) {
    return deserializeIntoPost;
}
/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {User}
 */
export function createUserFromDiscriminatorValue(parseNode: ParseNode | undefined) : ((instance?: Parsable) => Record<string, (node: ParseNode) => void>) {
    return deserializeIntoUser;
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoPost(post: Partial<Post> | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "body": n => { post.body = n.getStringValue(); },
        "id": n => { post.id = n.getNumberValue(); },
        "title": n => { post.title = n.getStringValue(); },
        "userId": n => { post.userId = n.getNumberValue(); },
    }
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoUser(user: Partial<User> | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "email": n => { user.email = n.getStringValue(); },
        "id": n => { user.id = n.getNumberValue(); },
        "name": n => { user.name = n.getStringValue(); },
        "username": n => { user.username = n.getStringValue(); },
    }
}
export interface Post extends AdditionalDataHolder, Parsable {
    /**
     * Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
     */
    additionalData?: Record<string, unknown>;
    /**
     * The body property
     */
    body?: string;
    /**
     * The id property
     */
    id?: number;
    /**
     * The title property
     */
    title?: string;
    /**
     * The userId property
     */
    userId?: number;
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializePost(writer: SerializationWriter, post: Partial<Post> | undefined = {}) : void {
    writer.writeStringValue("body", post.body);
    writer.writeNumberValue("id", post.id);
    writer.writeStringValue("title", post.title);
    writer.writeNumberValue("userId", post.userId);
    writer.writeAdditionalData(post.additionalData);
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializeUser(writer: SerializationWriter, user: Partial<User> | undefined = {}) : void {
    writer.writeStringValue("email", user.email);
    writer.writeNumberValue("id", user.id);
    writer.writeStringValue("name", user.name);
    writer.writeStringValue("username", user.username);
    writer.writeAdditionalData(user.additionalData);
}
export interface User extends AdditionalDataHolder, Parsable {
    /**
     * Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
     */
    additionalData?: Record<string, unknown>;
    /**
     * The email property
     */
    email?: string;
    /**
     * The id property
     */
    id?: number;
    /**
     * The name property
     */
    name?: string;
    /**
     * The username property
     */
    username?: string;
}
/* tslint:enable */
/* eslint-enable */
