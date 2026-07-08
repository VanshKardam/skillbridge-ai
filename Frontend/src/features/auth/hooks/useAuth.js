import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, googleLogin as googleLoginApi } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true }
        }
        catch(err) {
            console.error("Login Error:", err)
            return { success: false, message: err.response?.data?.message || err.message }
        }
        finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password})
            setUser(data.user)
            return { success: true }
        }
        catch(err) {
            console.error("Register Error:", err)
            return { success: false, message: err.response?.data?.message || err.message }
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        }
        catch(err) {

        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            }
            catch(err) {
                setUser(null)
            }
            finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    const handleGoogleLogin = async (token) => {
        setLoading(true)
        try {
            const data = await googleLoginApi(token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error("Google Login Error:", err);
            return { success: false, message: err.response?.data?.message || err.message };
        } finally {
            setLoading(false);
        }
    }

    return {user, loading, handleRegister, handleLogin, handleLogout, handleGoogleLogin}
}