import Image from "next/image";

const ShowMemberClasses = ({member, index}) => {

      // calc daysleft section
  // vars to handle daysleft
const currentDate = new Date();
const today = (currentDate).getTime();
const millisecondsPerDay = 1000 * 60 * 60 * 24;

               // compute days left per-member using the shared `today` and `millisecondsPerDay`
               const finishTs = member?.finishAt ? new Date(member.finishAt).getTime() : null;
               const msLeft = finishTs ? finishTs - today : null;
               const daysLeftRow = msLeft != null ? Math.floor(msLeft / millisecondsPerDay) : '--';
               const rowClass = typeof daysLeftRow === 'number' && daysLeftRow > 0 ? 'text-success' : 'text-danger';

               return (
                 <tr key={member.id}>
                   <td className="text-center">{index + 1}</td>
                   <td className="text-center">{member.client_CI}</td>
                   <td className="text-center">
                     <div style={{ width: 48, height: 48, position: 'relative', margin: '0 auto' }}>
                       <Image
                         src={member.image ? `${BackendURL}${member.image}` : '/assets/images/user-fallback.png'}
                         alt={member.client_CI ?? 'Member'}
                         fill
                         style={{ objectFit: 'cover', borderRadius: 6 }}
                       />
                     </div>
                   </td>
                   <td className="text-center">{member.classname}</td>
                   <td className="text-center">{member.timedays}</td>
                   <td className="text-center">{member.cost}</td>
                   <td className="text-center">{member.code}</td>
                   <td className="text-center">{member.status}</td>
                   <td className="text-center"><em className={`p-2 ${rowClass}`}>{daysLeftRow}</em></td>
                 </tr>
               );
             }
            
          

            

export default ShowMemberClasses;