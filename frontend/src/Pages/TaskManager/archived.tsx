import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";

const TopNavigation = () => {
  return (
    <div className="w-full bg-white p-4 shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-semibold">E-commerce Dashboard</h1>
      <div>
        <Button variant="outline" className="mr-4">
          Notifications
        </Button>
        <Button>Profile</Button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Button variant="ghost" className="w-full">
            Home
          </Button>
        </li>
        <li className="mb-4">
          <Button variant="ghost" className="w-full">
            Products
          </Button>
        </li>
        <li className="mb-4">
          <Button variant="ghost" className="w-full">
            Orders
          </Button>
        </li>
        <li className="mb-4">
          <Button variant="ghost" className="w-full">
            Customers
          </Button>
        </li>
      </ul>
    </div>
  );
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopNavigation />

        <main className="p-6">
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Cards for Sales Data */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p>$25,000</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p>1,234 Orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>567</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Table */}
          <div className="mt-8">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Product 1</TableCell>
                  <TableCell>$30</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>
                    <Button>Edit</Button>
                  </TableCell>
                </TableRow>
                {/* Add more rows here */}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
