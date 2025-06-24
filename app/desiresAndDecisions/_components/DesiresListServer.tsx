import { getDesires } from '@/lib/desiresService';
import DesiresListClient from './wishList';

export interface Desires {
  id: number;
  str_user_id: string;                    
  str_wishName: string;          
  str_wishDescription: string | null;   // Adicione | null
  dbl_wishValue: number;         
  str_image: string | null;             // Adicione | null
  dtm_createAt: Date;                   // Adicione estes novos campos
  dtm_updateAt: Date;
}

interface DesireListProps {
  userId: string | null | undefined;
}

export default async function DesiresListServer({ userId }: DesireListProps) {
  const desires = await getDesires(userId);
  return <DesiresListClient desires={desires} userId={userId} />;
}