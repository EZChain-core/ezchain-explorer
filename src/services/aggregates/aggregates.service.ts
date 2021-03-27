import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const AGGREGATES_V2_API_BASE_URL =
    process.env.VUE_APP_AGGREGATES_V2_API_BASE_URL

export function getAggregates(param: string) {
    return api
        .get(`${AGGREGATES_V2_API_BASE_URL}/${param}`)
        .then(resolveResponseData)
}

const ASSET_AGGREGATES_V2_API_BASE_URL =
    process.env.VUE_APP_ASSET_AGGREGATES_V2_API_BASE_URL

export function getAssetAggregates() {
    return api
        .get(`${ASSET_AGGREGATES_V2_API_BASE_URL}`)
        .then(resolveResponseData)
}