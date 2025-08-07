import express from 'express'
import { userLogin, userLogout, userSignup } from '../controllers/auth.controllers.js';

const authRoute=express.Router();
authRoute.post('/signup',userSignup)
authRoute.post('/logout',userLogout)
authRoute.post('/login',userLogin)

export default authRoute;