import ProfileAddress from "./ProfileAddress";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";

export default function ProfileDetails({ data }) {
    return (
        <div className="space-y-8 animate-fadeIn">
            <ProfileHeader data={data} />
            <ProfileInfo data={data} />
            <ProfileAddress data={data} />
        </div>
    );
}
