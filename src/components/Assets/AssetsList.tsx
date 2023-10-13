import { useEffect, useState } from "react";
import { AssetType, useAssetStore } from "../../api/useAssetStore";
import { Asset } from "./Asset";
import { PDF } from "../Pdf/Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DatePicker from "react-datepicker";
import { addDays, format } from "date-fns";
import { useTypeStore } from "../../api/useTypeStore";
import "./Asset.css";
import "react-datepicker/dist/react-datepicker.css";

enum SearchType {
  ByName = "byName",
  ById = "byId",
}

export const AssetsList = () => {
  const {
    assets,
    fetchAsset,
    getAssetsByName,
    getAssetsByDate,
    createAsset,
    getAssetsById,
  } = useAssetStore();

  const { types, fetch } = useTypeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState(SearchType.ByName);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSearch = (query: string) => {
    if (query) {
      if (searchType === SearchType.ByName) {
        getAssetsByName(query);
      } else if (searchType === SearchType.ById) {
        getAssetsById(query);
      }
    } else {
      fetchAsset();
    }
  };

  const handleCreate = () => {
    const data = {
      name: "Новий матеріальний актив",
      commissioningDate: Date.now(),
      cost: 1000,
      writeOffDate: addDays(Date.now(), 100),
      releaseDate: Date.now(),
      serviceTerm: 100,
      id: "111101111",
    };
    const defaultTypeId = "6527add14333de02dd7ae71c";

    createAsset(data, defaultTypeId);
  };

  const handleClose = () => {
    fetchAsset();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      getAssetsByDate(startDate, endDate);
    }
  }, [getAssetsByDate, isOpen, startDate, endDate]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div>
      <div className="panel">
        <div className="search">
          <p>
            Пошук:
            <select
              className="searchInput"
              onChange={(e: any) => {
                setSearchType(e.target.value);
              }}
            >
              <option value={SearchType.ByName}>за ім'ям</option>
              <option value={SearchType.ById}>за інвентарним номером</option>
            </select>
          </p>
          <input
            className="searchInput"
            type="text"
            onChange={(e: any) => handleSearch(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => setIsOpen(true)}>Сформувати звіт</button>
        </div>
      </div>

      {isOpen ? (
        <div className="popup-container">
          <div className="popup-body">
            <h3>Формування звіту за вибраний період</h3>
            <div className="dates">
              <div className="date">
                <p>Початкова дата</p>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                />
              </div>
              <div className="date">
                <p>Кінцева дата</p>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                />
              </div>
            </div>
            <PDFDownloadLink
              document={
                <PDF
                  assets={assets}
                  startDate={startDate}
                  endDate={endDate}
                  types={types}
                />
              }
              fileName={`Список матеріальних активів, введених в експлуатацію за період з ${format(
                startDate,
                "MM/dd/yyyy"
              )} до ${format(endDate, "MM/dd/yyyy")}.pdf`}
            >
              {({ loading }) =>
                loading ? "Завантаження документу..." : "Завантажити звіт"
              }
            </PDFDownloadLink>
            <button className="close-button" onClick={handleClose}>
              Закрити
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="row">
        <p>№</p>
        <p>Інвентарний номер (id)</p>
        <p>Найменування матеріального активу</p>
        <p>Вид активу</p>
        <p>Вартість балансова</p>
        <p>Дата випуску</p>
        <p>Дата введення в експлуатацію</p>
        <p>Термін служби (в днях)</p>
        <p>Дата списання</p>
      </div>
      {assets.map((asset: AssetType, ind: number) => (
        <div key={asset._id}>
          <Asset asset={asset} ind={ind + 1} types={types} />
        </div>
      ))}
      <button className="add-button" onClick={handleCreate}>
        Додати новий запис
      </button>
    </div>
  );
};
