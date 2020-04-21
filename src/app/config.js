export const outlookConfig = () => ({
    base: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    params: {
        'response_type': 'token',
        'client_id': 'eb4e2dd4-51e9-4711-b8c6-361fc36033f8',
        'scope': 'https://outlook.office.com/Calendars.ReadWrite',
        'redirect_uri': chrome.identity.getRedirectURL('calendar-sync')
    }
})

export const intraConfig = () => ({
    
})