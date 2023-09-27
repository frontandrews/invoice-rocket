import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

interface FloatingMenuProps {
  buttonOptions: {
    name: string;
    icon: any;
    onClick: () => void;
  }[];
}

export const FloatingMenu = ({ buttonOptions }: FloatingMenuProps) => {
  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 focus:ring-0 focus:outline-none">
        <span>Export</span>
        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-2 flex w-screen -translate-x-32 max-w-[160px]">
          <div className="w-screen max-w-xs flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div>
              {buttonOptions.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex rounded-lg hover:bg-gray-50"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-sm ">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <button
                    onClick={item.onClick}
                    className="font-semibold text-gray-900"
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default FloatingMenu;
