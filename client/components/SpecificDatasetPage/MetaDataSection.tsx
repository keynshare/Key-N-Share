import Link from "next/link";
interface Feature {
  key?: string;
  label?: string;
  description?: string;
}

type ColumnsSectionProp={
  Schema?:string;
  features?: Feature[];
  About?: string;
  Source?: string;
  datasetId?: string;
}


export default function MetaDataSection({ Schema="" ,About,Source, datasetId}:ColumnsSectionProp) {

// Parse the schema string and convert to array format
const parseSchema = (schemaString: string) => {
  if (!schemaString || schemaString === "") return [];
  
  try {
    const schemaObj = JSON.parse(schemaString);
    return Object.entries(schemaObj).map(([key, description]) => ({
      key,
      label: key,
      description: description as string
    }));
  } catch (error) {
    console.error('Error parsing schema:', error);
    return [];
  }
};

const columnData = parseSchema(Schema);

return (
  <section className="space-y-4 pt-6 dark:border-t-gray-600 border-gray-300 border-t">
     <div className="space-y-4  ">
    <h2 className="text-xl font-semibold font-bricola ">About Dataset</h2>
    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          {About}
    </p>
  </div>
 { columnData.length > 0 && <h2 className="text-xl font-semibold font-bricola ">Columns/Features Descriptions:</h2>}
    <div className="grid md:grid-cols-2 gap-6">
      {columnData.length > 0 && columnData.map((f) => (
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
  <div className="mt-6">
    <Link
    target="_blank"
      href='https://explorer.solana.com/address/9dGx4usjmHMv9osGXBi2UMhH6bxCq4kWasH5ZAqZoijd?cluster=devnet'
      className="text-sm text-orange-500 hover:underline"
    >
      View on Solana Explorer
    </Link>
  </div>
  </section>
);
}