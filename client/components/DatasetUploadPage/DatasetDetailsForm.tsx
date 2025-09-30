"use client"
import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn";
import { FolderUp, X, DollarSign, TrendingUp } from "lucide-react";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import { DatasetFormData } from "@/components/DatasetUploadPage/UploadDataset";
import { useState, useEffect } from "react";

interface DatasetDetailsFormProps {
  formData: DatasetFormData;
  onFormDataChange: (updates: Partial<DatasetFormData>) => void;
  onUpload: () => void;
  isUploading: boolean;
}

function DatasetDetailsForm({ formData, onFormDataChange, onUpload, isUploading }: DatasetDetailsFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [solanaPrice, setSolanaPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch Solana price
  const fetchSolanaPrice = async () => {
    try {
      setPriceLoading(true);
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      setSolanaPrice(data.solana.usd);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching Solana price:', err);
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    fetchSolanaPrice();
    const interval = setInterval(fetchSolanaPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateUSDValue = () => {
    if (!formData.price || !solanaPrice || isNaN(parseFloat(formData.price))) {
      return 0;
    }
    return (parseFloat(formData.price) * solanaPrice).toFixed(2);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      onFormDataChange({ tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFormDataChange({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onUpload(); }}>
      {/* Dataset Name + Source in one row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dataset Name *</label>
          <input 
            type="text" 
            placeholder="Dataset Name" 
            value={formData.title}
            onChange={(e) => onFormDataChange({ title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source of Data*</label>
          <input 
            type="text" 
            placeholder="eg: this data was taken from spotify" 
            value={formData.source}
            onChange={(e) => onFormDataChange({ source: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
          />
        </div>
      </div>

      {/* Enhanced Price Section with Real-time USD Conversion */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Price (SOL) *</label>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp size={12} />
            {priceLoading ? (
              <span>Loading...</span>
            ) : (
              <span>1 SOL = {solanaPrice ? solanaPrice.toFixed(2) : "Loading..."} USD</span>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {/* SOL Input */}
          <div className="relative">
            <input 
              type="number" 
              step="0.001"
              min="0"
              placeholder="Enter Price in Solana" 
              value={formData.price}
              onChange={(e) => onFormDataChange({ price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 pr-12" 
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 font-medium text-sm">SOL</span>
            </div>
          </div>
          
          {/* USD Value Display */}
          {formData.price && !priceLoading && solanaPrice && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">USD Value:</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ${calculateUSDValue()}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formData.price} SOL × ${solanaPrice.toFixed(2)} = ${calculateUSDValue()} USD
              </div>
            </div>
          )}
          
          {/* Live Update Indicator */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <button
              type="button"
              onClick={fetchSolanaPrice}
              disabled={priceLoading}
              className="flex items-center gap-1 hover:text-orange-500 transition-colors"
            >
              <TrendingUp size={12} className={priceLoading ? 'animate-spin' : ''} />
              {priceLoading ? 'Updating...' : 'Refresh Price'}
            </button>
            {lastUpdated && (
              <span>Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tags/Categories Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categories/Tags *</label>
        <div className="space-y-2">
          {/* Tag Input */}
          <div className="flex flex-wrap gap-2">
            <input 
              type="text" 
              placeholder="Enter categories/tags (e.g., Music, Data Science, Technology)" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 w-full sm:w-fit bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Add
            </button>
          </div>
          
          {/* Quick Add Buttons */}
          <div className="flex flex-wrap gap-2">
            {['Music', 'Technology', 'Finance', 'Healthcare', 'Education', 'Sports', 'Data Science', 'Machine Learning'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  if (!formData.tags.includes(suggestion)) {
                    onFormDataChange({ tags: [...formData.tags, suggestion] });
                  }
                }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-[#101010] dark:hover:bg-[#1d1d1d] hover:bg-gray-200 rounded-full border dark:border-gray-700 border-gray-300"
              >
                + {suggestion}
              </button>
            ))}
          </div>
          
          {/* Display Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-orange-600 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Add categories/tags to help users find your dataset. At least one category is required.</p>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image*</label>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Click to upload Cover Image" 
            value={formData.coverImage ? formData.coverImage.name : ""}
            readOnly
            className="w-full px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg focus:outline-none bg-gray-50" 
          />
          <SecondaryBtn 
            className="bg-black text-white px-3 rounded-l-none"
            onClick={() => document.getElementById('cover-image')?.click()}
          >
            <FolderUp/>
          </SecondaryBtn>
        </div>
        <input
          id="cover-image"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFormDataChange({ coverImage: file });
            }
          }}
          accept="image/*"
        />
      </div>

      {/* Schema */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Schema of Dataset in JSON Format</label>
        <textarea  
          placeholder="eg: artist-name: Name of the artist, songs-no: number of songs" 
          value={formData.schema}
          onChange={(e) => onFormDataChange({ schema: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" 
          rows={6}
        />
        <div className="mt-2">
          <button
            type="button"
            onClick={() => {
              const exampleSchema = `{
  "spotify_track_uri": "Unique identifier for each Spotify track",
  "ts": "Timestamp of the streaming event",
  "platform": "Platform used for streaming (e.g., iOS, Android, Web)",
  "ms_played": "Milliseconds the track was played",
  "track_name": "Name of the track",
  "artist_name": "Name of the artist",
  "album_name": "Name of the album",
  "reason_start": "Reason for starting the track (e.g., click, play_button)",
  "reason_end": "Reason for ending the track (e.g., endplay, trackdone)",
  "shuffle": "Whether shuffle was enabled",
  "skipped": "Whether the track was skipped"
}`;
              onFormDataChange({ schema: exampleSchema });
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Use Spotify Dataset Schema Example
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea 
          rows={3} 
          placeholder="Describe your dataset..." 
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"  
          required
        />
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="terms" 
          checked={formData.termsAccepted}
          onChange={(e) => onFormDataChange({ termsAccepted: e.target.checked })}
          className="h-3 w-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500" 
          required
        />
        <label htmlFor="terms" className="text-gray-600 text-sm">I accept the terms and conditions *</label>
      </div>

      <PrimaryBtn 
        Type="submit"
        sparkelClass="hidden"
        disabled={isUploading}
        className={isUploading ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isUploading ? "Uploading..." : "Upload Dataset"}
      </PrimaryBtn>
    </form>
  );
}

export default DatasetDetailsForm;