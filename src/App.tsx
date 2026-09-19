import { EditView } from '@/components/EditView'
import { usePlanStore } from '@/hooks/usePlanStore'

export default function App() {
  const { plan, setPlan } = usePlanStore()

  return (
    <div className="h-screen bg-background">
      <EditView plan={plan} setPlan={setPlan} />
    </div>
  )
}
