import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import useCreatePost from '../../hooks/useCreatePost';
import './createpost.css'
export default function CreatePost({reply=null}){

    useEffect(() => {
        register('post')
    });

    const formSchema = Yup.object().shape({
        post: Yup.string()
            .required("* Required field")
            .max(280, "* Message to long")
    });

    const { register, handleSubmit, formState: { errors }, setValue, setError} = useForm({
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

    const createPostMutation = useCreatePost()

    async function submitPost(data){
        try {
            let post = {
                post: {
                    message: data.post
                }
            }

            if(reply){
                post.post.id_post_reply = reply
            }

            let createPost = await createPostMutation.mutateAsync(post)
            document.getElementById("tweet").textContent = "";

            if(reply){
                console.log(createPost.data)
            }
        } catch (error) {
            if(error.response.data){
                console.log(error.response.data)
                document.getElementById("tweet").textContent = "";
                setError("message", {message: "Error al crear el post"})
            }
        }
    }

    let myplaceholder;
    if(reply){
        myplaceholder = "Type your reply" 
    }else{
        myplaceholder = "What's happening?"
    }

    return (
        <form onSubmit={handleSubmit(submitPost)}>
            <div className='textarea' id="tweet" onKeyDown={ctChars} contentEditable="true" placeholder={myplaceholder} onInput={(e) => {setValue('post', e.currentTarget.textContent, { shouldValidate: true });}}/>
            <div className="bottom">
                <span className="text-danger">{errors.post?.message}</span>
                <span id='tweetcounter' data-limit="280" >280</span>
                <button id='postbutton' type="submit" tabIndex="0" disabled>
                    <span tabIndex="-1">Post</span>
                </button>
            </div>
        </form>
    )
}