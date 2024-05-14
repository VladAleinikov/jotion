
interface PublicLayoutProps{children: React.ReactNode}

const PublicLayout = ({children}:PublicLayoutProps) => {
  return (
    <div className="dark:bg-[#1F1F1F]">
      {children}
    </div>
  )
}

export default PublicLayout