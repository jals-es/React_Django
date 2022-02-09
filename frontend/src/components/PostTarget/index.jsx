import { ChatBubbleOutline, Repeat, FavoriteBorder, Share } from '@material-ui/icons';
import { useState } from 'react';
import UserTarget from '../../components/UserTarget';
import useCreateLikeMutation from '../../hooks/useCreateLikeMutation';
import useCreateRepeatMutation from '../../hooks/useCreateRepeatMutation';
import useDeleteLikeMutation from '../../hooks/useDeleteLikeMutation';
import useDeleteRepeatMutation from '../../hooks/useDeleteRepeatMutation';
import './post.css'
export default function PostTarget({data}){
    const [you_like, setYouLike] = useState(data.data.you_like)
    const [you_repeat, setYouRepeat] = useState(data.data.you_repeat)
    const [nlike, setNLike] = useState(data.data.nlikes)
    const [nrepeat, setNRepeat] = useState(data.data.nrepeats)
    let fecha = new Date(data.date)

    let userRepeat = null;
    if(data.data.user_repeat){
        userRepeat = <p className='userRepeat mx-3'><Repeat className='mr-2'/> Repeated by @{data.data.user_repeat}</p>
    }

    const createLikeMutation = useCreateLikeMutation()
    const deleteLikeMutation = useDeleteLikeMutation()
    const createRepeatMutation = useCreateRepeatMutation()
    const deleteRepeatMutation = useDeleteRepeatMutation()

    async function like(){
        if(you_like === 1){
            setYouLike(0)
            setNLike(nlike - 1)
            try {
                await deleteLikeMutation.mutateAsync(data.id)
            } catch (error) {
                setYouLike(1)
                setNLike(nlike + 1)
            }     
        }else if(you_like === 0){
            setYouLike(1)
            setNLike(nlike + 1)
            try {
                await createLikeMutation.mutateAsync(data.id)
            } catch (error) {
                setYouLike(0)
                setNLike(nlike - 1)
            }     
        }   
    }

    async function repeat(){
        if(you_repeat === 1){
            setYouRepeat(0)
            setNRepeat(nrepeat - 1)
            try {
                await deleteRepeatMutation.mutateAsync(data.id)
            } catch (error) {
                setYouRepeat(1)
                setNRepeat(nrepeat + 1)
            }
        }else if(you_repeat === 0){
            setYouRepeat(1)
            setNRepeat(nrepeat + 1)
            try {
                await createRepeatMutation.mutateAsync(data.id)
            } catch (error) {
                setYouRepeat(0)
                setNRepeat(nrepeat - 1)
            }
        }
    }

    return (
        <div id={data.id} className='feedSection post'>
            {userRepeat}
            <div className="title">
                <UserTarget data={data.user} pfollow={false}/>
            </div>
            <div className="tweet">
                <p>{data.message}</p>
            </div>
            <div className="time-and-date">
                <p>{fecha.toLocaleString()} <span>MeToChat for {data.agent}</span></p>
            </div>
            <div className="bottom-section">
                <span className='commentIcon'>
                    <ChatBubbleOutline className='mr-2'/>
                </span>
                <span onClick={repeat} className={`repeatIcon ${you_repeat > 0 ? 'active' : ''}`}>
                    <Repeat className='mr-2'/>
                    {nrepeat}
                </span>
                <span onClick={like} className={`likeIcon ${you_like > 0 ? 'active' : ''}`}>
                    <FavoriteBorder className='mr-2'/>
                    {nlike}
                </span>
                <span className='shareIcon'>
                    <Share/>
                </span>
            </div>
        </div>
    )
}