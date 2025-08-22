
interface Feature {
    key?: string;
    label?: string;
    description?: string;
}

type ColumnsSectionProp={
    features?: Feature[];
    About?: string;
    Source?: string;
  }


export default function MetaDataSection({ features ,About,Source}:ColumnsSectionProp) {
  return (
    <section className="space-y-4 pt-6 dark:border-t-gray-600 border-gray-300 border-t">
       <div className="space-y-4  ">
      <h2 className="text-xl font-semibold font-bricola ">About Dataset</h2>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
            {About}
      </p>
    </div>
      <h2 className="text-xl font-semibold font-bricola ">Columns/Features Descriptions:</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {features?.map((f) => (
          <div key={f.key} className="grid grid-cols-2 gap-2 border-b dark:border-gray-800 pb-4">
            <div>
              <div className="text-sm font-medium">{f.label}</div>
              <div className="text-xs text-gray-500">{f.description}</div>
            </div>
          </div>
        ))}
      </div>
       <div className="space-y-3 mt-4">
      <h2 className="text-xl font-semibold">Source</h2>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
            {Source}
      </p>
    </div>
    </section>
  );
}