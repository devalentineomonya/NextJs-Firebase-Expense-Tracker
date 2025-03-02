import Image from "next/image";
import Earth from "@/public/earth.png";
import { Button } from "@/components/ui/button";

const UpgradeCard = () => (
  <div className="bg-primary-subtle position-relative overflow-hidden rounded-4 m-30 my-2 rounded-md bg-[#5d87ff20]">
    <div className="grid grid-cols-12 p-6 gap-6">
      <div className="col-span-6">
        <h5 className="text-base mb-3.5 font-semibold leading-5">
          Unlimited Access
        </h5>
        <Button
          variant="default"
          className="bg-primary text-white hover:bg-primary-dark"
        >
          Upgrade Now
        </Button>
      </div>
      <div className="col-span-6">
        <div className="-m-3 unlimited-img">
          <Image
            className="w-full scale-[1.17]"
            src={Earth}
            alt="Unlimited access"
            width={152}
            height={126}
          />
        </div>
      </div>
    </div>
  </div>
);

export default UpgradeCard;
