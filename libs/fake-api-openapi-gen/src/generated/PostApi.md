# .PostApi

All URIs are relative to *https://jsonplaceholder.typicode.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPosts**](PostApi.md#getPosts) | **GET** /posts | 


# **getPosts**
> Array<Post> getPosts()

Get posts

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PostApi(configuration);

let body:.PostApiGetPostsRequest = {
  // number | Filter results by user ID (optional)
  userId: 1,
  // number | Limit results by number (optional)
  limit: 1,
};

apiInstance.getPosts(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**number**] | Filter results by user ID | (optional) defaults to undefined
 **limit** | [**number**] | Limit results by number | (optional) defaults to undefined


### Return type

**Array<Post>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


