import { ChatBubbleOutline, Repeat, FavoriteBorder, Share } from '@material-ui/icons';
import UserTarget from '../../components/UserTarget';
import './post.css'
export default function PostTarget({data}){

    let fecha = new Date(data.date)

    let classNameLike = null;
    if(data.data.you_like === 1){
        classNameLike = "likeIcon active"
    }else if(data.data.you_like === 0){
        classNameLike = "likeIcon"
    }

    let classNameRepeat = null;
    if(data.data.you_repeat === 1){
        classNameRepeat = "repeatIcon active"
    }else if(data.data.you_repeat === 0){
        classNameRepeat = "repeatIcon"
    }

    let userRepeat = null;
    if(data.data.user_repeat){
        userRepeat = <p className='userRepeat mx-3'><Repeat className='mr-2'/> Repeated by @{data.data.user_repeat}</p>
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
                <span className={classNameRepeat}>
                    <Repeat className='mr-2'/>
                    {data.data.nrepeats}
                </span>
                <span className={classNameLike}>
                    <FavoriteBorder className='mr-2'/>
                    {data.data.nlikes}
                </span>
                <span className='shareIcon'>
                    <Share/>
                </span>
            </div>
        </div>
    )
}