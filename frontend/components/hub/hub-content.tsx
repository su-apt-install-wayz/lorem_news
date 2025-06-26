import { PropsWithChildren } from "react"

export function HubContent(props: PropsWithChildren) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-2 p-4 md:py-6">
                    {props.children}
                </div>
            </div>
        </div>
    )
}
