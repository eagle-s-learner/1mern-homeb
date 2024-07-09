export default function Perks({selected, onChange}) {

    function handleCbClick(ev) {
        const {checked, name} = ev.target;
        if(checked){
            onChange(prev => {
                return [...prev, name];
            })
        }else{
            onChange(prev => {
                const newPerk = prev.filter(selectedName => selectedName !== name)
                return newPerk;
            })
        }
      }
  return (
    <>
      <label className="border p-4 rounded-2xl cursor-pointer">
        <input type="checkbox" checked={selected.includes("Wifi")} name="Wifi" onChange={handleCbClick} />
        <span>Wifi</span>
      </label>
      <label className="border p-4 rounded-2xl cursor-pointer">
        <input type="checkbox" checked={selected.includes("Parking")} name="Parking" onChange={handleCbClick} />
        <span>Parking</span>
      </label>
      <label className="border p-4 rounded-2xl cursor-pointer">
        <input type="checkbox" checked={selected.includes("Food")} name="Food" onChange={handleCbClick} />
        <span>Food</span>
      </label>
      <label className="border p-4 rounded-2xl cursor-pointer">
        <input type="checkbox" checked={selected.includes("TV")} name="TV" onChange={handleCbClick} />
        <span>TV</span>
      </label>
      <label className="border p-4 rounded-2xl cursor-pointer">
        <input type="checkbox" checked={selected.includes("Car")} name="Car" onChange={handleCbClick} />
        <span>Remote Control Car</span>
      </label>
    </>
  );
}
