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

// TODO: the .superRefine should be a reusable function of avoiding duplicate data in an array 
const regexFormSchema = z.object({
  fields: z.array(
    z.object({
      name: z.string()
        .min(1, "Name is required")
        .max(64, "Name too long (max 64 characters)"),
      regex: z.string().min(1, "Regex is required"),
    })
  ).superRefine((fields, ctx) => {
    // Track seen names and regexes
    const seenNames = new Set<string>();
    const seenRegexes = new Set<string>();

    fields.forEach((field, index) => {
      // Check for duplicate names
      if (seenNames.has(field.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Name must be unique. "${field.name}" is already used.`,
          path: [index, "name"],
        });
      } else {
        seenNames.add(field.name);
      }

      // Check for duplicate regexes
      if (seenRegexes.has(field.regex)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Regex must be unique. "${field.regex}" is already used.`,
          path: [index, "regex"],
        });
      } else {
        seenRegexes.add(field.regex);
      }
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

  useEffect(() => {
    const subscription = form.watch((values) => {
      const _fields = values.fields?.filter((field): field is DataExtractionRegexField => field !== undefined && field.name !== undefined && field.regex !== undefined) || [];
      setRegexFields(_fields);
    });
    return () => subscription.unsubscribe();
  }, [form, setRegexFields]);

  const handleAddField = () => append({ name: "", regex: "a" });
  const handleRemoveField = (index: number) => remove(index);

  console.log("regexFields", regexFields);
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
                    <FormLabel>Regex</FormLabel>
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
    </Form >
  );
};

export default RegexForm;