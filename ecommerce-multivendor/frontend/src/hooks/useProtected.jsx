import React from 'react'
import { protectedRoute } from '../api'
import { useNavigate } from 'react-router-dom'

function useProtected(navigateTo = '/login') {
    const [data, setData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await protectedRoute()
                if (result.success) {
                    setData(result.user)
                } else {
                    setError(result.message)
                    navigate(navigateTo)
                }
            } catch (error) {
                setError(error.message)
                navigate(navigateTo)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return { data, loading, error }
}

export default useProtected