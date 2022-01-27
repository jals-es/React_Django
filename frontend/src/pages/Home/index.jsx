
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import './home.css'
export default function Home() {

    useEffect(() => {
        register('post')
    });

    const formSchema = Yup.object().shape({
        post: Yup.string()
            .required("* Campo requerido")
            .max(280, "* Campo demasiado largo")
    });

    const { register, handleSubmit, formState: { errors }, reset, setValue} = useForm({
        mode: "onSubmit",
        resolver: yupResolver(formSchema)
    });

    function ctChars(e) { 
        let el = e.target,
            to = setTimeout(function() {
                let len = el.textContent.length,
                    ct = document.getElementById("tweetcounter"),
                    btn = document.getElementById("postbutton"),
                    warnAt = 20,
                    max = ct.getAttribute("data-limit");

                ct.innerHTML = max - len;
                ct.className = len > max - warnAt ? "warn" : "";
                btn.disabled = len === 0 || len > max ? true : false;
                el.value = el.textContent;
                clearTimeout(to);
            }, 1);
    }

    function submitPost(data){
        console.log(data)
        reset()
    }
    return (
        <div id="user-feed h-100">
            <div className="row row1">
                <div className="col-12 bg-success"></div>
            </div>
            <div className="row row2">
                <div className="col-lg-3 col-md-6 col-sm-12 bg-warning">

                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className='feedSection'>
                        <form onSubmit={handleSubmit(submitPost)}>
                            <div className='textarea' id="tweet" onKeyDown={ctChars} contentEditable="true" placeholder="What’s happening?" onInput={(e) => {setValue('post', e.currentTarget.textContent, { shouldValidate: true });}}/>
                            <div className="bottom">
                                <span className="text-danger">{errors.post?.message}</span>
                                <span id='tweetcounter' data-limit="280" >280</span>
                                <button id='postbutton' type="submit" tabIndex="0" disabled>
                                    <span tabIndex="-1">Post</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 bg-danger"></div>
            </div>
        </div>
    )
}