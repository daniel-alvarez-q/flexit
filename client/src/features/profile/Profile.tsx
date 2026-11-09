import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import ContentSection from "../../shared/components/ContentSection";
import EventMessage from "../../shared/components/EventMessage";
import KpiCard from "../../shared/components/KpiCard";
import './profile.css'


function Profile(){

    const {user, axios_instance} = useAuth()!

    const metrics_query = useQuery({
        queryKey: ['test-query'],
        queryFn: async():Promise<Object> => {
            const data = await axios_instance.get('api/user/metrics').then(r=>r.data)
            const kpis = {
                'Completed sessions':[data['total_sessions'], 0],
                'Completed exercises' : [data['total_exercise_logs'],0],
                'Completed sessions (7 days)':[data['session_count_current_week'], data['session_count_last_week']],
                'Completed exercises (7 days)': [data['logs_current_week'], data['logs_last_week']],
                'Active minutes (7 days)':[data['session_minutes_current_week'], data['session_minutes_last_week']],
                'Total volume (7 days)': [data['total_volume_current_week'], data['total_volume_last_week']]
            }
            return kpis
        }
    })

    console.log(metrics_query)
    
    return <>
        <div className="row mb-3">
            <div className="template-header">
                <div className="template-title">
                    {user?.username}
                </div>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col">
            <ContentSection title="Your stats" loading={metrics_query.isLoading}>
                {metrics_query.isSuccess ?
                    <div className="row g-2">
                        {Object.entries(metrics_query.data).map(((k,i) => 
                        <div className="col-6" key={i}>
                            <KpiCard label={k[0]} value={k[1][0]} delta_reference={k[1][1]}/>
                        </div>
                        ))}
                    </div>
                : metrics_query.isError && 
                    <EventMessage style="error" message={metrics_query.error.message}/>
                }
            </ContentSection>
            </div>
        </div>
    </>
}

export default Profile