import http from './http'
import popupInfo from './popupInfo'

export default function* () {
    yield http,
    yield popupInfo
}