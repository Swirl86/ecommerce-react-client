import { useState } from "react";
import ProfileAddress from "./ProfileAddress";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";

export default function ProfileDetails({ data, refetch, refresh }) {
    const [editingSection, setEditingSection] = useState(null);
    // null | "profile" | "address"

    return (
        <div className="space-y-8 animate-fadeIn">
            <ProfileHeader data={data} />

            <ProfileInfo
                data={data}
                refetch={refetch}
                refresh={refresh}
                isEditing={editingSection === "profile"}
                onEdit={() => setEditingSection("profile")}
                onCancel={() => setEditingSection(null)}
            />

            <ProfileAddress
                data={data}
                refetch={refetch}
                isEditing={editingSection === "address"}
                onEdit={() => setEditingSection("address")}
                onCancel={() => setEditingSection(null)}
            />
        </div>
    );
}
