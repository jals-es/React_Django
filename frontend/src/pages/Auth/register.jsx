import React from "react";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import useRegister from '../../hooks/useRegisterMutation'
import { useNavigate } from "react-router-dom";
import './Auth.css'
export default function Register() {
    const navigate = useNavigate();

    const formSchema = Yup.object().shape({
        username: Yup.string()
            .required("Campo requerido")
            .max(15, 'Maximo 15 digitos'),
        email: Yup.string()
            .required("Campo requerido")
            .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email no valido"),
        name: Yup.string()
            .required("Campo requerido")
            .max(40, 'Maximo 40 digitos'),
        password: Yup.string()
            .required("Campo requerido")
            .min(8, "Minimo 8 caracteres")
            .max(20, "Minimo 20 caracteres")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "Requerido digitos, minusculas y mayusculas"),
        cpassword: Yup.string()
            .required("Campo requerido") 
            .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    });

    const { register, handleSubmit, formState: { errors }, reset} = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
    });

    const registerMutation = useRegister()

    var registerOnSubmit = async(data) => {
        try {
            await registerMutation.mutateAsync(data)
            reset()
            navigate("/login");
        } catch (error) {

        }
    }

    return (
        <div id='register' className="wrapper">
            <div className="container">
                <h1>Registro</h1>
                
                <form className="form" onSubmit={handleSubmit(registerOnSubmit)} autoComplete="off">
                    <input name="password"type="text" placeholder="Username" {...register("username")}/>
                    <p className="text-danger">{errors.username?.message}</p>
                    <input type="text" placeholder='Email' {...register("email")}/>
                    <p className="text-danger">{errors.email?.message}</p>
                    <input type="text" placeholder='Name' {...register("name")}/>
                    <p className="text-danger">{errors.name?.message}</p>
                    <input type="password" placeholder="Password"{...register("password")}/>
                    <p className="text-danger">{errors.password?.message}</p>
                    <input type="password" placeholder='Repeat Password' {...register("cpassword")}/>
                    <p className="text-danger">{errors.cpassword?.message}</p>
                    <p>¿Ya tienes cuenta? <Link to="/login/">Entrar</Link></p>
                    <button type="submit" id="register-button">Crear</button>
                </form>
            </div>
                
            <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    )
}