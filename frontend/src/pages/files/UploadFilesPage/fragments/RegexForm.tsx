import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataExtractionRegexField, dataExtractionRegexFields } from '@/utils/constants/dataExtractionRegexFields';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import unique from '@/utils/zod/unique';

// TODO: the .superRefine should be a reusable function of avoiding duplicate data in an array 


interface Props {
  regexFields: DataExtractionRegexField[];
  setRegexFields: React.Dispatch<React.SetStateAction<DataExtractionRegexField[]>>;
}

const RegexForm = ({ regexFields, setRegexFields }: Props) => {
  const { t } = useTranslation();
  const regexFormSchema = z.object({
    fields: z.array(
      z.object({
        name: z.string()
          .min(1, `${t("NAME")} ${t("IS_REQUIRED")}`)
          .max(64, `${t("NAME")} ${t("TOO_LONG")}`),
        regex: z.string().min(1, `${t("REGEX")} ${t("IS_REQUIRED")}`),
      })
    )
      .superRefine(
        unique([
          { key: "name", message: `${t("NAME")} ${t("MUST_BE_UNIQUE")}.` },
          { key: "regex", message: `${t("REGEX")} ${t("MUST_BE_UNIQUE")}.` },
        ])
      )
  });
  const form = useForm<z.infer<typeof regexFormSchema>>({
    resolver: zodResolver(regexFormSchema),
    mode: "onChange",
    defaultValues: {
      fields: regexFields
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const _fields = values.fields?.filter((field): field is DataExtractionRegexField => field !== undefined && field.name !== undefined && field.regex !== undefined) || [];
      setRegexFields(_fields);
    });
    return () => subscription.unsubscribe();
  }, [form, setRegexFields]);

  const handleAddField = () => append({ name: "", regex: "a" });
  const handleRemoveField = (index: number) => remove(index);

  return (
    <Form {...form}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 border border-input p-4 rounded-md">
            <div className="flex-1 grid gap-4 grid-cols-2">
              <FormField
                control={form.control}
                name={`fields.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("NAME")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Field name"
                        {...field}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`fields.${index}.regex`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("REGEX")}</FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a regex" />
                      </SelectTrigger>

                      <SelectContent>
                        {dataExtractionRegexFields.map((regexItem) => (
                          <SelectItem key={regexItem.name} value={regexItem.name}>
                            {regexItem.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-1 "
              onClick={() => handleRemoveField(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddField}
        >
          {t("ADD_REGEX_FIELD")}
        </Button>
      </div>
    </Form >
  );
};

export default RegexForm;