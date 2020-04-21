import { twolegAuthResponse, hubsResponse } from "./forgeInterfaces"
import * as functions from 'firebase-functions'
import axios from 'axios'
import * as querystring from 'querystring'

export class forgeAPIWrapper {
    private static urlRoot = `https://developer.api.autodesk.com`
    private static instance?: forgeAPIWrapper;
    
    private constructor(){
        
    }

    static getInstance = () => {
        if(forgeAPIWrapper.instance){
            return forgeAPIWrapper.instance;
        } else {
            forgeAPIWrapper.instance = new forgeAPIWrapper();
            return forgeAPIWrapper.instance;
        }
    }

    getToken = async (): Promise<twolegAuthResponse> => {
        //TODO: factor out functions.config() dependency
        const client_id = functions.config().forgeapi.client_id
        const client_secret = functions.config().forgeapi.client_secret
        const url = `${forgeAPIWrapper.urlRoot}/authentication/v1/authenticate`
        // scopes need to be URI encoded
        // const scope = encodeURI(`data:read account:read`)
        const scope = 'data:read account:read data:create data:write viewables:read'
        
        try {
            const forgeResponse = await axios({
                method: 'post',
                url,
                // data needs to be in a query string
                data: querystring.stringify({
                    client_id,
                    client_secret,
                    'grant_type': 'client_credentials',
                    scope,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            return (forgeResponse.data)

        } catch (error) {
            throw error
        }
    }

    getHubs = async (): Promise<hubsResponse> => {
        try {
            const t = await this.getToken()
            const token = t.access_token;
            const url = `${forgeAPIWrapper.urlRoot}/project/v1/hubs`
            const response = await axios({
                method: 'get',
                url,
                headers: {
                    'Authorization': `Bearer ` + token,
                    'Accept': '*/*'
                }
            })
            
            return response.data
        } catch (error) {
            throw error
        }
    }

    getProjects = async (hubId: string) => {
        try {
            const t = await this.getToken()
            const token = t.access_token;
            const url = `${forgeAPIWrapper.urlRoot}/project/v1/hubs/${hubId}/projects`

            const response = await axios({
                method: 'get',
                url,
                headers: {
                    'Authorization': `Bearer ` + token,
                    'Accept': '*/*'
                }
            })
            
            return response.data
            
        } catch (error) {
            throw error    
        }
    }

    getProjectTopFolder = (hubId: string) => async (projectId: string) => {
        try {
            const t = await this.getToken()
            const token = t.access_token;
            const url = `${forgeAPIWrapper.urlRoot}/project/v1/hubs/${hubId}/projects/${projectId}/topFolders`
            
            const response = await axios({
                method: 'get',
                url,
                headers: {
                    'Authorization': `Bearer ` + token,
                    'Accept': '*/*'
                }
            })
            
            return response.data
        } catch (error) {
            throw error
        }
    }
    
    getProjectContents = (projectId: string) => async (folderId: string) => {
        // TODO: add optional params (https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-folders-folder_id-contents-GET/)
        try {
            const t = await this.getToken()
            const token = t.access_token;
            const url = `${forgeAPIWrapper.urlRoot}/data/v1/projects/${projectId}/folders/${folderId}/contents`
            
            const response = await axios({
                method: 'get',
                url,
                headers: {
                    'Authorization': `Bearer ` + token,
                }
            })
            
            return response
        } catch (error) {
            throw error
        }
    }

}