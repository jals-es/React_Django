import UserTarget from '../../components/UserTarget';
import useGetSuggestedUsersQuery from '../../hooks/useGetSuggestedUsersQuery';
export default function SuggestedUsers(){
    var suggestedUsers = null;

    const {data} = useGetSuggestedUsersQuery();

    if(data?.data && data.data.length > 0){
        suggestedUsers = data.data.map((user)=>
            <UserTarget key={user.username} data={user}/>
        );
    }else{
        suggestedUsers = <p className='mx-3 fst-italic'>We can't find recomended users</p>
    }

    return (
        <div>
            <div className='title px-3 pt-3'>
                <p>Recomended users</p>
            </div>
            {suggestedUsers}
        </div>
    )
}