
import { useState } from "react";
import { useRouter } from "next/router";
import SearchableSelect from "@/components/ui/SearchableSelect";

export default function EditAddress() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "Denla",
    lastName: "Dunamis",
    phone: "760956767",
    additionalPhone: "756253902",
    address: "Dina apartments Ntinda",
    additionalInfo: "A few meters below Capital Shoppers",
    region: "Kampala Region",
    city: "Ntinda",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSelectChange = (name: "region" | "city", value: string) => {
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Form submitted:", formData);
  router.push("/account");
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        className="mb-6 text-blue-600 hover:underline"
        onClick={() => router.push("/account")}
      >
        &larr; Back to Account
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Additional Phone</label>
              <input
                name="additionalPhone"
                value={formData.additionalPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <SearchableSelect
                value={formData.region}
                onChange={(value) => handleSelectChange("region", value)}
                options={[
                  { value: "Kampala Region", label: "Kampala Region" },
                  { value: "Central Region", label: "Central Region" },
                  { value: "Eastern Region", label: "Eastern Region" },
                ]}
                placeholder="Select region"
                className="w-full border border-gray-300 rounded p-2 text-left"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <SearchableSelect
                value={formData.city}
                onChange={(value) => handleSelectChange("city", value)}
                options={[
                  { value: "Ntinda", label: "Ntinda" },
                  { value: "Kampala", label: "Kampala" },
                  { value: "Entebbe", label: "Entebbe" },
                ]}
                placeholder="Select city"
                className="w-full border border-gray-300 rounded p-2 text-left"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
