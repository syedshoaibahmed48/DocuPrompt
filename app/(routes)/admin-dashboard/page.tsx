"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PieChart, Pie, Cell, Label as ChartLabel } from "recharts"
import { Users, HardDrive, Zap, FileText, Database, ChevronRight, ChevronLeft } from "lucide-react"
import Logo from "@/components/Logo"
import { getAllData, grantStandardAccess, ignoreStandardAccessRequest, signout } from "@/lib/apiClient"
import { useRouter } from "next/navigation"
import { calcStatPercentage, commaSeparatedNumber, formattedFileSize } from "@/lib/FileMetaDataUtils"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { FirebaseUsageStats, PineconeUsageStats, StandardAccessRequest, UsersAggregatedByType, UsersList } from "@/models/app-interfaces"
import { generateUsername, generateStrongPassword } from "@/lib/AuthUtils"


export default function AdminDashboard() {

    const router = useRouter()

    const [openAiUsage, setOpenAiUsage] = useState({
        totalTokensUsed: 0,
        chatCompletions: 0,
        embeddings: 0
    });
    const [firebaseUsageStats, setFirebaseUsageStats] = useState<FirebaseUsageStats>({
        storageUsed: 0,
        storageLimit: 1
    });
    const [pineconeUsageStats, setPineconeUsageStats] = useState<PineconeUsageStats>({
        namespacesCount: 0,
        totalRecordCount: 0
    });
    const [usersAggregatedByType, setUsersAggregatedByType] = useState<UsersAggregatedByType[]>([]);
    const [usersList, setUsersList] = useState<UsersList[]>([]);
    const [accessRequests, setAccessRequests] = useState<StandardAccessRequest[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [requestsPage, setRequestsPage] = useState(1);
    const itemsPerPage = 3

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = usersList.slice(indexOfFirstUser, indexOfLastUser);

    const indexOfLastRequest = requestsPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    const currentRequests = accessRequests.slice(indexOfFirstRequest, indexOfLastRequest);


    const [isGrantAccessModalOpen, setIsGrantAccessModalOpen] = useState(false);
    const [generatedUsername, setGeneratedUsername] = useState("");
    const [selectedEmail, setSelectedEmail] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState("");

    const handleGrantRequestedAccess = (userName?: string, email?: string) => {
        setGeneratedUsername(generateUsername(userName!) || '');
        setSelectedEmail(email || '');
        setGeneratedPassword(generateStrongPassword());
        setIsGrantAccessModalOpen(true);
    }

    async function handleGrantAccess() {
        if (!generatedUsername || !selectedEmail || !generatedPassword) return;
        const response = await grantStandardAccess(generatedUsername, selectedEmail, generatedPassword);
        if (response.success) {
            setIsGrantAccessModalOpen(false);
            setAccessRequests(accessRequests.filter(request => request.email !== selectedEmail));
        }
    }

    async function handleIgnoreAccessRequest(email: string) {
        const response = await ignoreStandardAccessRequest(email);
        if (response.success) {
            setAccessRequests(accessRequests.filter(request => request.email !== email));
        }
    }

    async function handleSignout() {
        await signout();
        router.push('/');
    }

    const handleCopyCredentials = () => {
        navigator.clipboard.writeText(`Username: ${generatedUsername}\nPassword: ${generatedPassword}`);
    }

    async function getDashboardData() {
        const { usersList, usersAggregatedByType, accessRequests, openAiUsage, firebaseUsageStats, pineconeUsageStats } = await getAllData();
        setUsersList(usersList);
        setAccessRequests(accessRequests);
        setUsersAggregatedByType(usersAggregatedByType);
        setOpenAiUsage(openAiUsage);
        setFirebaseUsageStats(firebaseUsageStats);
        setPineconeUsageStats(pineconeUsageStats);
    }

    useEffect(() => {
        getDashboardData();
    }, [])

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <header className="w-full bg-background border-b border-b-neutral-700 mb-4">
                <nav className="relative flex items-center justify-between w-full h-14 z-10 px-4">
                    <Logo />
                    <button type="button" className="btn-outline px-3 py-2" onClick={handleSignout}>Sign out</button>
                </nav>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4">
                <div className="flex flex-col gap-2">
                    <Card className="bg-neutral-900 border-neutral-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-medium">OpenAI Tokens Used</CardTitle>
                            <Zap className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-2">{commaSeparatedNumber(openAiUsage.totalTokensUsed)}</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs text-neutral-400">Chat Completions</p>
                                    <p className="text-sm font-semibold">{commaSeparatedNumber(openAiUsage.chatCompletions)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-400">Embeddings</p>
                                    <p className="text-sm font-semibold">{commaSeparatedNumber(openAiUsage.embeddings)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-neutral-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-medium">Standard Access Requests</CardTitle>
                            <FileText className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{accessRequests.length}</div>
                            <p className="text-xs text-neutral-400 mt-1">Pending approval</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-2">
                    <Card className="bg-neutral-900 border-neutral-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-medium">Firebase Files Storage Used</CardTitle>
                            <HardDrive className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formattedFileSize(firebaseUsageStats.storageUsed)}</div>
                            <p className="text-xs text-neutral-400 mb-2">{calcStatPercentage(firebaseUsageStats.storageUsed, firebaseUsageStats.storageLimit)}% of {formattedFileSize(firebaseUsageStats.storageLimit)} limit</p>
                            <div className="w-full bg-neutral-700 rounded-sm h-2 mb-3">
                                <div
                                    className="bg-purple-600 h-full rounded-sm"
                                    style={{ width: `${calcStatPercentage(firebaseUsageStats.storageUsed, firebaseUsageStats.storageLimit)}%` }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-neutral-900 border-neutral-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-medium">Pinecone Storage Used</CardTitle>
                            <Database className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{commaSeparatedNumber(pineconeUsageStats.namespacesCount)} NamespacesCount</div>
                            <p className="text-sm text-neutral-400 font-extralight">
                                Total Records: <span className="font-semibold text-white">{commaSeparatedNumber(pineconeUsageStats.totalRecordCount)}</span>
                            </p>
                        </CardContent>
                    </Card>

                </div>
                <Card className="bg-neutral-900 border-neutral-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-0 pb-0">
                        <CardTitle className="text-xl font-medium">App Users</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent className="mb-0 pb-0">
                        <ChartContainer
                            config={{
                                demo: {
                                    label: "demo",
                                },
                                standard: {
                                    label: "standard",
                                },
                                admin: {
                                    label: "admin",
                                }
                            }}
                            className="mx-auto aspect-square h-[240px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={usersAggregatedByType}
                                    dataKey="count"
                                    nameKey="userType"
                                    innerRadius={60}
                                    strokeWidth={5}
                                >
                                    {usersAggregatedByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.userType === "demo" ? "rgb(249 115 22)" : entry.userType === "standard" ? "rgb(34 197 94)" : "rgb(59 130 246)"} />
                                    ))}
                                    <ChartLabel
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-white text-3xl"
                                                        >
                                                            {commaSeparatedNumber(usersList.length)}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-white"
                                                        >
                                                            Users
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                                <ChartLegend content={<ChartLegendContent className="text-lg capitalize" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-4 px-4">
                <div className="flex justify-between items-center">
                    <TabsList className="bg-neutral-800">
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="requests">Access Requests</TabsTrigger>
                    </TabsList>
                    <Button className="bg-neutral-800 py-6 hover:bg-neutral-700" onClick={() => { handleGrantRequestedAccess('', '') }}>Add New User</Button>
                </div>
                <TabsContent value="users" className="space-y-4">
                    <div className="rounded-md border border-neutral-700">
                        <table className="w-full text-sm text-left text-neutral-300">
                            <thead className="text-xs uppercase bg-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        UserName
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        User Type
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Files Uploaded
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Storage Used
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Prompts Used
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.userName} className="border-b border-neutral-700">
                                            <td className="px-6 py-4">{user.userName}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.userType}</td>
                                            <td className="px-6 py-4">{user.filesUploaded}</td>
                                            <td className="px-6 py-4">{formattedFileSize(user.storageUsed!)}</td>
                                            <td className="px-6 py-4">{user.promptsUsed}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-b border-neutral-700" >
                                        <td className="px-6 py-4 text-center" colSpan={6}>No users</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center">
                        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center bg-neutral-800 hover:bg-neutral-700">
                            <ChevronLeft className="mr-2" />
                            Previous
                        </Button>
                        <p className="text-sm">
                            Page - {currentPage} / <span className="bg-neutral-700 py-1 px-2 rounded-lg">{Math.ceil(usersList.length / itemsPerPage)}</span>
                        </p>
                        <Button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={indexOfLastUser >= usersList.length} className="flex bg-neutral-800 hover:bg-neutral-700">
                            Next
                            <ChevronRight className="ml-2" />
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="requests" className="space-y-4">
                    <div className="rounded-md border border-neutral-700">
                        <table className="w-full text-sm text-left text-neutral-300">
                            <thead className="text-xs uppercase bg-neutral-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Comments
                                    </th>
                                    <th scope="col" className="flex flex-row justify-center px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRequests.length ? (
                                    currentRequests.map((request) => (
                                        <tr key={request.email} className="border-b border-neutral-700">
                                            <td className="px-6 py-4">{request.name}</td>
                                            <td className="px-6 py-4">{request.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="truncate max-w-xs" title={request.comments || 'no comments'}>
                                                    {request.comments || 'no comments'}
                                                </div>
                                            </td>
                                            <td className="flex flex-row justify-center py-2">
                                                <Button onClick={() => handleGrantRequestedAccess(request.name, request.email)} className="bg-neutral-800 hover:bg-neutral-700 mr-2">
                                                    Grant Access
                                                </Button>
                                                <Button variant="destructive" onClick={() => { handleIgnoreAccessRequest(request.email) }} className="bg-red-600 hover:bg-red-400">Ignore</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-b border-neutral-700" >
                                        <td className="px-6 py-4 text-center" colSpan={6}>No pending requests</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center">
                        <Button onClick={() => setRequestsPage((prev) => Math.max(prev - 1, 1))} disabled={requestsPage === 1} className="flex items-center bg-neutral-800 hover:bg-neutral-700">
                            <ChevronLeft className="mr-2" />
                            Previous
                        </Button>
                        <p className="text-sm">
                            Page - {requestsPage} / <span className="bg-neutral-700 py-1 px-2 rounded-lg">{Math.ceil(accessRequests.length / itemsPerPage)}</span>
                        </p>
                        <Button
                            onClick={() => setRequestsPage((prev) => prev + 1)}
                            disabled={indexOfLastRequest >= accessRequests.length}
                            className="flex items-center bg-neutral-800 hover:bg-neutral-700"
                        >
                            Next
                            <ChevronRight className="ml-2" />
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog
                open={isGrantAccessModalOpen}
                onOpenChange={(open) => {
                    setIsGrantAccessModalOpen(open);
                    if (!open) {
                        setGeneratedUsername("");
                        setSelectedEmail("");
                        setGeneratedPassword("");
                    }
                }}
            >
                <DialogContent className="bg-neutral-950 text-white">
                    <DialogHeader>
                        <DialogTitle>Grant Access</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Handle form submission
                            setIsGrantAccessModalOpen(false);
                        }}
                        autoComplete="off"
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="userName" className="text-right">
                                    UserName
                                </Label>
                                <Input
                                    id="userName"
                                    className="col-span-3 bg-neutral-800"
                                    value={generatedUsername}
                                    onChange={(e) => {
                                        setGeneratedUsername(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={selectedEmail}
                                    onChange={(e) => {
                                        setSelectedEmail(e.target.value);
                                    }}
                                    className="col-span-3 bg-neutral-800"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="text"
                                    value={generatedPassword}
                                    readOnly
                                    onChange={(e) => {
                                        setGeneratedPassword(e.target.value);
                                    }}
                                    className="col-span-3 bg-neutral-800"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button type="button" className="bg-neutral-800 hover:bg-neutral-700" onClick={handleCopyCredentials}>
                                Copy Credentials
                            </Button>
                            <Button type="button" className="bg-neutral-800 hover:bg-neutral-700" onClick={handleGrantAccess}>
                                Grant Access
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

