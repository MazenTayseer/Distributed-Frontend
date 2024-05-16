import MachineStatus from "@components/MachineStatus";

const Machines = () => {
  return (
    <section className='py-16 bg-white site-padding'>
      <h2 className='text-4xl mb-4 font-semibold'>Machine Status</h2>

      <div className='flex items-center justify-between gap-12 container'>
        <MachineStatus host="master001"/>
        <MachineStatus host="node001"/>
        <MachineStatus host="node002"/>
      </div>
    </section>
  );
};

export default Machines;
