import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataExtractionRegexField, dataExtractionRegexFields } from '@/utils/constants/dataExtractionRegexFields';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const regexFormSchema = z.object({
  fields: z.array(
    z.object({
      name: z.string()
        .min(1, "Name is required")
        .max(64, "Name too long (max 64 characters)"),
      regex: z.string().min(1, "Regex is required"),
    })
  )
  // .transform((value) => uniqBy(value, 'name'));
  .superRefine((fields, ctx) => {
    const names = fields.map(field => field.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    console.log("dupl", duplicates);
    duplicates.forEach((name, index) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Names must be unique. Remove the field: ${name}`,
        path: [index, "name"],
      });
    });
  })
});

interface Props {
  regexFields: DataExtractionRegexField[];
  setRegexFields: React.Dispatch<React.SetStateAction<DataExtractionRegexField[]>>;
}

const RegexForm = ({ regexFields, setRegexFields }: Props) => {
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

  const handleAddField = () => {
    append({ name: "", regex: "" });
    setRegexFields([...regexFields, { name: "", regex: "" }]);
  };

  const handleRemoveField = (index: number) => {
    remove(index);
    const updatedFields = [...regexFields];
    updatedFields.splice(index, 1);
    setRegexFields(updatedFields);
  };

  console.log("values", form.getValues());
  console.log("errors", form.formState.errors);

  return (
    <Form {...form}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-end">
            <div className="flex-1 grid gap-4 grid-cols-2">
              <FormField
                control={form.control}
                name={`fields.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Field name" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setRegexFields(form.getValues().fields);
                        }}
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
                    <FormLabel>Regex</FormLabel>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRegexFields(form.getValues().fields);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a regex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="a">Select a regex</SelectItem>
                        {dataExtractionRegexFields.map((regexItem) => (
                          <SelectItem key={regexItem.name} value={regexItem.regex}>
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
              className="mb-1"
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
          Add Regex Field
        </Button>
      </div>
    </Form>
  );
};

export default RegexForm;