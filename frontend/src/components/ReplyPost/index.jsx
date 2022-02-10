import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
// import { Modal } from 'react-bootstrap'
import './replypost.css'
export default function ReplyPost({id_post_reply}){

    useEffect(() => {
        register('post')
    });

    const formSchema = Yup.object().shape({
        post: Yup.string()
            .required("* Required field")
            .max(280, "* Message to long")
    });

    const { register, handleSubmit, formState: { errors }, setValue} = useForm({
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

    async function submitPost(data){
        console.log(data);
    }

    return (
        <div className="modal fade" id={`reply${id_post_reply}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <form onSubmit={handleSubmit(submitPost)}>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div className='textarea' id="tweet" onKeyDown={ctChars} contentEditable="true" placeholder="What's happening?" onInput={(e) => {setValue('post', e.currentTarget.textContent, { shouldValidate: true });}}/>
                            <div className="bottom">
                                <span className="text-danger">{errors.post?.message}</span>
                                <span id='tweetcounter' data-limit="280" >280</span>
                                <button id='postbutton' type="submit" tabIndex="0" disabled>
                                    <span tabIndex="-1">Post</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-body">
                                    
                    </div>
                </div>
            </div>
        </div>
    )
}