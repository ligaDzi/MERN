import { useState, useCallback } from 'react'

// Наш хук запросов на сервер
export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Наш метод обернут в useCallback(), чтобы он не входил в рекурсию
    const request = useCallback( async (url, method = 'GET', body = null, headers = {}) => {

        setLoading(true)
        try {
            if(body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(url, { method, body, headers })
            const data = await response.json()
            
            if(!response.ok) throw new Error(data.message || 'Что-то пошло не так.')
            
            setLoading(false)            
            
            return data
            
        } catch (error) {
            setLoading(false)   
            setError(error.message)
            // throw error                     
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {
        loading,
        error,
        request,
        clearError
    }
}