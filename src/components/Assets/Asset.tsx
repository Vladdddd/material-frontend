import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAssetStore } from "../../api/useAssetStore";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { format, addDays } from "date-fns";
import "./Asset.css";
import "react-datepicker/dist/react-datepicker.css";
import { Type } from "../../api/useTypeStore";

type Inputs = {
  name: string;
  commissioningDate: Date;
  cost: number;
  type: string;
  releaseDate: Date;
  serviceTerm: number;
  id: string;
};

export const Asset = ({ asset, ind, types }) => {
  const { updateAsset, deleteAsset } = useAssetStore();

  const [typeName, setTypeName] = useState("");
  const [isEdit, setEdit] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: asset.id,
      name: asset.name,
      commissioningDate: new Date(asset.commissioningDate),
      cost: asset.cost,
      type: asset.type,
      releaseDate: new Date(asset.releaseDate),
      serviceTerm: asset.serviceTerm,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newData = {
      ...data,
      writeOffDate: addDays(data.commissioningDate, Number(data.serviceTerm)),
    };
    updateAsset(newData, asset._id);
    setEdit(false);
  };

  const handleDelete = (id: string) => {
    deleteAsset(id);
  };

  useEffect(() => {
    types.forEach((type: Type) => {
      if (type._id === asset.type) setTypeName(type.name);
    });
  }, [types, asset.type]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {isEdit ? (
          <>
            <div className="input">
              <input type="text" value={ind} disabled />
            </div>
            <div className="input">
              <input
                pattern="^[0-9]*$"
                className={errors.id ? "error" : ""}
                {...register("id", {
                  required: true,
                  maxLength: 9,
                })}
              />
            </div>
            <div className="input">
              <input
                className={errors.name ? "error" : ""}
                {...register("name", { required: true, maxLength: 50 })}
              />
            </div>
            <div className="select">
              <select {...register("type")} defaultValue={asset.type}>
                {types.map((type: Type) => (
                  <option value={type._id} key={type._id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="input">
              <input
                type="number"
                className={errors.cost ? "error" : ""}
                {...register("cost", {
                  required: true,
                  max: 999999999,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="input">
              <Controller
                control={control}
                name="releaseDate"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select date"
                    onChange={(date: Date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </div>
            <div className="input">
              <Controller
                control={control}
                name="commissioningDate"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select date"
                    onChange={(date: Date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </div>
            <div className="input">
              <input
                type="number"
                className={errors.serviceTerm ? "error" : ""}
                {...register("serviceTerm", {
                  required: true,
                  max: 99999,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="input">
              <input
                value={format(
                  addDays(new Date(asset.commissioningDate), asset.serviceTerm),
                  "MM/dd/yyyy"
                )}
                disabled
              />
            </div>
          </>
        ) : (
          <>
            <p>{ind}</p>
            <p>{asset.id}</p>
            <p>{asset.name}</p>
            <p>{typeName}</p>
            <p>{asset.cost}</p>
            <p>{format(new Date(asset.releaseDate), "MM/dd/yyyy")}</p>
            <p>{format(new Date(asset.commissioningDate), "MM/dd/yyyy")}</p>
            <p>{asset.serviceTerm}</p>
            <p>{format(new Date(asset.writeOffDate), "MM/dd/yyyy")}</p>
          </>
        )}
      </div>
      <div className="buttons">
        {isEdit ? (
          <input type="submit" value="Зберегти" />
        ) : (
          <>
            <button onClick={() => setEdit(true)}>Редагувати</button>
            <button onClick={() => handleDelete(asset._id)}>Видалити</button>
          </>
        )}
      </div>
    </form>
  );
};
