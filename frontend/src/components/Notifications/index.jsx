import useGetNotifyQuery from '../../hooks/useGetNotifyQuery';
import useDeleteNotify from '../../hooks/useDeleteNotifyMutation';
import { useQueryClient } from "react-query"
import './notify.css'
export default function Notifications(){

    const {data:notifications} = useGetNotifyQuery() 
    const deleteNotification = useDeleteNotify()
    const queryClient = useQueryClient()

    async function deleteNotify(e){
        try {
            await deleteNotification.mutateAsync({'id_notification': e.target.id})
            await queryClient.invalidateQueries('get_notify');
        } catch (error) {
            console.log("error al borrar")
        }   
    }
    
    var notify = []
    if(notifications?.data?.length > 0){
        
        notify = notifications.data.map((notify) =>
            <div className='notify' key={notify.id}> 
                <p className='title'>{notify.title}</p>
                <p className='message'>{notify.message}</p>
                <button onClick={deleteNotify} id={notify.id}>X</button>
            </div>
        )
    }

    return (
        <div id="notifications" className="py-3">
            {notify}
        </div>
    )
}

