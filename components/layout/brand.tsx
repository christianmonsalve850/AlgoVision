import Image from "next/image"

export function Brand() {
    return (
        <div className="flex items-center">
            <Image
                src="/logo.svg"
                alt="AlgoVision Logo"
                className="mr-3 rounded-lg bg-white"
                width={40}
                height={40}
            />
            <h1 className="text-lg font-bold text-foreground">AlgoVision</h1>
        </div>
    )
}